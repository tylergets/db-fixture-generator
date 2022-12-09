import {render} from "mustache";
import { faker } from "@faker-js/faker";
import FixtureGenerator from "./generator";

export default class Entity {
    key: string;
    private generator: FixtureGenerator;
    private fields: Record<string, any>;
    variables: Record<string, any>;

    constructor(generator: FixtureGenerator, key: string, fields: Record<string, any>, variables: Record<string, any>) {
        this.generator = generator;
        this.key = key;
        this.variables = variables;
        this.fields = fields;
    }

    protected getFieldValue(key: string) {
        let fieldValue = this.fields[key];

        if (typeof fieldValue === 'number') {
            return fieldValue;
        }

        if (typeof fieldValue === 'string' && fieldValue.startsWith("@")) {
            let refValue = this.generator.getReferenceValue(fieldValue.substring(1));
            if (this.generator.options.formatRelationship) {
                refValue = this.generator.options.formatRelationship('unknown', refValue);
            }
            return refValue;
        }

        return render(fieldValue.toString(), {
            ...this.variables,
            ...this.getHelpers(),
            ...faker,
        });
    }

    getDependencies() {
        return Object.entries(this.fields)
        .filter(([key, value]) => {
            if (typeof value === 'string') {
                return value.startsWith("@");
            }
            return false;
        })
        .map(([key, value]) => {
            return value.substring(1);
        })
    }

    protected getHelpers() {
        return {
            id: () => {
                return parseInt(this.variables.i + 1);
            }
        }
    }

    toJSON() {
        const output: any = {};

        for (const [key, value] of Object.entries(this.fields)) {
            output[key] = this.getFieldValue(key);
        }

        output['__key'] = this.key;

        return output;
    }
};
