export default class FixtureField {
    key: string;
    value: string;

    constructor(key: string, value: string) {
        this.key = key;
        this.value = value;
    }

    get isRef(): boolean {
        return this.value.startsWith("@");
    }
}