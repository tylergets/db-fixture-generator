import {FixtureGeneratorOptions} from "./options";
import Entity from "./entity";
import {YamlParser} from "./yaml";
import {DepGraph} from "dependency-graph";

export interface FixtureData {
    key: string;
    type: string;
    repeat?: number;
    if?: string | boolean | (() => boolean);
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

    validate() {
        // verify that no fixtures have the same key
        const keys = this.fixtures.map((f) => f.key);
        const uniqueKeys = [...new Set(keys)];
        if (keys.length !== uniqueKeys.length) {
            const duplicates = keys.filter((item, index) => keys.indexOf(item) !== index);
            throw new Error(`Duplicate fixture keys found: ${duplicates.join(', ')}`);
        }
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
        await this.validate();

        let entities = [];

        for (const fixture of this.fixtures) {

            fixture.repeat ??= 1;

            for (let r = 0; r < fixture.repeat; r++) {
                const type = fixture.type;
                let key = fixture.key;

                if (fixture.repeat > 1) {
                    key = `${key}${r + 1}`;
                }

                let entity = new Entity(this, key, type, fixture.if, fixture.fields, {
                    r: r+1,
                    rt: fixture.repeat,
                });

                if (entity.passesConditional()) {
                    this.graph.addNode(key, entity);
                    entities.push([key, entity]);
                }
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

    getReferenceValue(key: string) {
        const ref = this.graph.getNodeData(key);
        return ref.toJSON();
    }

    count() {
        return this.fixtures.length;
    }

}
