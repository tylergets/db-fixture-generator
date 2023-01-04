import Mustache from "mustache";
import { faker } from "@faker-js/faker";
import FixtureGenerator from "./generator";

type EntityConditional = undefined | string | boolean | (() => boolean);

export default class Entity {
    key: string;
    type: string;

    conditional?: EntityConditional;

    variables: Record<string, any> = {};

    private generator: FixtureGenerator;
    private readonly fields: Record<string, any>;

    private _resolvedData: any;

    constructor(generator: FixtureGenerator, key: string, type: string, conditional: EntityConditional, fields: Record<string, any>, variables: Record<string, any> = {}) {
        this.generator = generator;
        this.key = key;
        this.type = type;
        this.conditional = conditional;
        this.variables = variables;
        this.fields = fields;
    }

    passesConditional() {
        if (this.conditional !== undefined) {
            if (typeof this.conditional === 'boolean') {
                return this.conditional;
            } else if (typeof this.conditional === 'string') {
                const parsed = this.parseFieldValue(this.conditional);
                return parsed === 'true';
            } else {
                return this.conditional();
            }
        }
        return true;
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

        if (typeof fieldValue === 'object') {
            return fieldValue;
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
            ...this.generator.options.helpers ?? {},
            key: () => {
                return this.getKey();
            },
            type: () => {
                return this.getType();
            },
            id: () => {
                return parseInt(this.variables.i);
            }
        }
    }

    getKey() {
        return this.key;
    }
    getType() {
        return this.type;
    }

    toJSON() {
        if (!this._resolvedData) {
            this._resolvedData = {};

            for (const [key, value] of Object.entries(this.fields)) {
                let fieldValue = this.fields[key];
                this._resolvedData[key] = this.parseFieldValue(fieldValue);
            }

            this._resolvedData['__key'] = this.key;
        }

        return this._resolvedData;

    }
};
