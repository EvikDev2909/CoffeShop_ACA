export function createMockResponse() {
    return {
        statusCode: null,
        body: null,
        status(code) {
            this.statusCode = code;
            return this;
        },
        json(payload) {
            this.body = payload;
            return this;
        }
    };
}

export function createNextSpy() {
    const calls = [];

    const next = (error) => {
        calls.push(error);
    };

    next.calls = calls;
    return next;
}
