import {FixtureGeneratorOptions} from "./options";
import Entity from "./entity";
import {YamlParser} from "./yaml";
import {DepGraph} from "dependency-graph";

export interface FixtureData {
    key: string;
    type: string;
    times?: number;
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

    async create(cb: (entityType: string, entityData: Record<string, any>) => void): Promise<void> {


        let entities = [];

        for (let i = 0; i < this.fixtures.length; i++){
            const fixture = this.fixtures[i];

            let entity = new Entity(this, fixture.key, fixture.fields, {
                i,
            });

            const key = fixture.key;

            this.graph.addNode(key, entity);
            entities.push([key, entity]);
        }

        for (const [key, entity] of entities) {
            for (const dep of await entity.getDependencies()) {
                this.graph.addDependency(key, dep);
            }
        }

        for (let i = 0; i < this.graph.overallOrder().length; i++){
            const name = this.graph.overallOrder()[i];
            const entity = this.graph.getNodeData(name);
            entity.variables.i = i;
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
