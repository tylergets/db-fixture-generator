import {FixtureGeneratorOptions} from "./options";
import Entity from "./entity";
import {YamlParser} from "./yaml";
import {DepGraph} from "dependency-graph";

export interface FixtureData {
    key: string;
    type: string;
    repeat?: number;
    fields: Record<string, any>;
}

export default class FixtureGenerator {

    private fixtures: FixtureData[];

    options: FixtureGeneratorOptions = {};

    graph = new DepGraph<Entity>();

    constructor(fixtures: FixtureData[], options: FixtureGeneratorOptions = {}) {
        this.fixtures = fixtures;
        this.options = options;
    }

    async all(): Promise<any[]> {
        return new Promise<any[]>(async (resolve, reject) => {
            const entities = [];
            await this.create((entityType, entityData) => {
                entities.push(entityData);
            })
            resolve(entities);
        })
    }

    async create(cb: (entityType: string, entityData: Record<string, any>) => void): Promise<void> {

        let entities = [];

        for (const fixture of this.fixtures) {

            fixture.repeat ??= 1;

            for (let r = 0; r < fixture.repeat; r++) {
                let key = fixture.key;

                if (fixture.repeat > 1) {
                    key = `${key}${r + 1}`;
                }

                let entity = new Entity(this, key, fixture.fields, {
                    r: r+1,
                    rt: fixture.repeat,
                });

                this.graph.addNode(key, entity);
                entities.push([key, entity]);
            }
        }

        for (const [key, entity] of entities) {
            let dependencies = entity.getDependencies();
            for (const dep of await dependencies) {
                this.graph.addDependency(key, dep);
            }
        }

        for (let i = 0; i < this.graph.overallOrder().length; i++){
            const name = this.graph.overallOrder()[i];
            const entity = this.graph.getNodeData(name);

            entity.variables.i = i + 1;
            cb(name, entity.toJSON());
        }
    }

    static async fromFiles(name: string, options: FixtureGeneratorOptions = {}): Promise<FixtureGenerator> {
        const parser = new YamlParser(name);
        return new FixtureGenerator(await parser.fixtures(), options);
    }

    getReferenceValue(key: string) {
        const ref = this.graph.getNodeData(key);
        if (!ref) {
            throw new Error(`Unable to find entity with key ${key}`);
        }
        return ref.toJSON();
    }

}
