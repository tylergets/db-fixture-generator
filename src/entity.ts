import Mustache from "mustache";
import { faker } from "@faker-js/faker";
import FixtureGenerator from "./generator";

export default class Entity {
    key: string;
    variables: Record<string, any> = {};

    private generator: FixtureGenerator;
    private readonly fields: Record<string, any>;

    constructor(generator: FixtureGenerator, key: string, fields: Record<string, any>, variables: Record<string, any> = {}) {
        this.generator = generator;
        this.key = key;
        this.variables = variables;
        this.fields = fields;
    }

    protected parseFieldValue(fieldValue: string) {

        if (Array.isArray(fieldValue)) {
            return fieldValue.map((v) => this.parseFieldValue(v));
        }

        if (typeof fieldValue === 'number') {
            return fieldValue;
        }

        if (typeof fieldValue === 'boolean') {
            return fieldValue;
        }

        if (typeof fieldValue === 'string' && fieldValue.startsWith("@")) {
            let refValue = this.generator.getReferenceValue(fieldValue.substring(1));
            if (this.generator.options.formatRelationship) {
                refValue = this.generator.options.formatRelationship('unknown', refValue);
            }
            return refValue;
        }

        return Mustache.render(fieldValue.toString(), {
            ...this.variables,
            ...this.generator.options.variables ?? {},
            ...this.getHelpers(),
            ...faker,
        });
    }

    getDependencies() {
        return Object.entries(this.fields)
        .flatMap(([key, value]) => {
            if (Array.isArray(value)) {
                return value;
            }
            return value;
        })
        .filter((value) => {
            if (typeof value === 'string') {
                return value.startsWith("@");
            }
            return false;
        })
        .map((value) => {
            return value.substring(1);
        })
    }

    protected getHelpers() {
        return {
            id: () => {
                return parseInt(this.variables.i);
            }
        }
    }

    toJSON() {
        const output: any = {};

        for (const [key, value] of Object.entries(this.fields)) {
            let fieldValue = this.fields[key];
            output[key] = this.parseFieldValue(fieldValue);
        }

        output['__key'] = this.key;

        return output;
    }
};
