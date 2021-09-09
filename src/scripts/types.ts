
type factorType = {
    type: string,
    value: number
};

type factorOrNull = factorType | null;

type declarationType = {
    property: string,
    value: string
};

type ruleType = {
    selector: string,
    declarations: declarationType []
};

type timeoutType = ReturnType<typeof setTimeout>;
type timeoutOrNull = timeoutType | null;

export {
    factorOrNull,
    ruleType,
    declarationType,
    timeoutOrNull
}