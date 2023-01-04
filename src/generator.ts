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
            await this.create((entityKey, entityType, entityData) => {
                entities.push(entityData);
            }).catch((err) => {
                reject(err);
            })
            resolve(entities);
        })
    }

    async create(cb: (entityKey: string, entityType: string, entityData: Record<string, any>) => void): Promise<void> {

        let entities = [];

        for (const fixture of this.fixtures) {

            fixture.repeat ??= 1;

            for (let r = 0; r < fixture.repeat; r++) {
                const type = fixture.type;
                let key = fixture.key;

                if (fixture.repeat > 1) {
                    key = `${key}${r + 1}`;
                }

                if (!type) {
                    throw new Error("No type found on fixture");
                }

                let entity = new Entity(this, key, type, fixture.fields, {
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
            const entityKey = this.graph.overallOrder()[i];
            const entity = this.graph.getNodeData(entityKey);

            entity.variables.i = i + 1;
            const entityData = entity.toJSON();
            const entityType = entity.getType();
            await cb(entityKey, entityType, entityData);
        }
    }

    static async fromFiles(name: string, options: FixtureGeneratorOptions = {}): Promise<FixtureGenerator> {
        const parser = new YamlParser(name);
        return new FixtureGenerator(await parser.fixtures(), options);
    }

    // This is broken as it calls to JSON instead of getting the previous value, maybe cache toJSON?
    getReferenceValue(key: string) {
        const ref = this.graph.getNodeData(key);
        return ref.toJSON();
    }

    count() {
        return this.fixtures.length;
    }

}
