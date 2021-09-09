
declare global {
    interface String {
        toPrettyText(): string;
    }
}

String.prototype.toPrettyText = function () {
    return this
        .split('\n')
        .join('')
        .trim();
};

export default {}