import {FixtureGeneratorOptions} from "./options";
import Formatter from "./formatter";
import fg from "fast-glob";
import {YamlParser} from "./yaml";

export interface FixtureData {
    key: string;
    type: string;
    times?: number;
    fields: Record<string, any>;
}

export default class FixtureGenerator {

    private fixtures: FixtureData[];
    private options: FixtureGeneratorOptions = {};

    private references: Record<string, string> = {};

    constructor(fixtures: FixtureData[], options: FixtureGeneratorOptions = {}) {
        this.fixtures = fixtures;
        this.options = options;
    }

    async create(cb: (entityType: string, entityData: Record<string, any>) => void): Promise<void> {

        const entities = [];

        for (let i = 0; i < this.fixtures.length; i++){
            const fixture = this.fixtures[i];
            let entity = new Formatter(fixture.fields, {
                i,
            });

            const data = entity.toJSON();
            data.__key = fixture.type;
            data.__dependencies = await entity.getDependencies();

            entities.push(data);
        }

        // TODO Determine Order Of Fixtures using Dependency Graph

        for (const entity of entities) {
            cb(entity.type, entity);
        }
    }

    static async fromFiles(name: string): Promise<FixtureGenerator> {
        console.log('pattern: ' + name);
        const parser = new YamlParser(name);
        return new FixtureGenerator(await parser.fixtures());
    }
}