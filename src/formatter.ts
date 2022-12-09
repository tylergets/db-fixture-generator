import {render} from "mustache";
import { faker } from "@faker-js/faker";

export default class Formatter {
    private fields: Record<string, any>;
    private variables: Record<string, any>;

    constructor(fields: Record<string, any>, variables: Record<string, any>) {
        this.variables = variables;
        this.fields = fields;
    }

    getFieldValue(key: string) {
        let fieldValue = this.fields[key];

        if (typeof fieldValue === 'number') {
            return fieldValue;
        }

        if (typeof fieldValue === 'string' && fieldValue.startsWith("@")) {
            return '__LOAD_RELATIONSHIP:' + fieldValue;
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

    getHelpers() {
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

        return output;
    }
};