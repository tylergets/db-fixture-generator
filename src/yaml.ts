import {FixtureData} from "./generator";
import fg from "fast-glob";
import fs from "fs-extra";
import * as path from "path";
import YAML from 'yaml'

export class YamlParser {

    pattern: string;

    constructor(pattern: string) {
        this.pattern = pattern;
    }

    protected files() {
        return fg([this.pattern]);
    }

    async fixtures(): Promise<FixtureData[]> {
        return this.files().then((r) => {
            return r.map((p) => {
                const ext = path.extname(p);
                return {
                    ext,
                    content: fs.readFileSync(p).toString()
                }
            }).map<FixtureData[]>((p) => {
                if (p.ext === '.yaml' || p.ext === '.yml') {
                    return this.parseFixtureAsYaml(p.content);
                } else {
                    throw new Error('Unrecognized file extension ' + p.ext);
                }
            })
        }).then((r) => {
            return r.flat();
        });
    }

    private parseFixtureAsYaml(content: string): FixtureData[] {
        const entities: FixtureData[] = [];
        for (const [key, data] of Object.entries(YAML.parse(content).entities)) {
            entities.push({
                key,
                fields: data,
                type: key,
            })
        }
        return entities;
    }
}
