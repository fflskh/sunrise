
class Request {
    constructor() {

    }

    /**
     * 将请求包裹为通用的请求
     * @param url
     */
    static wrapper (url) {
        return {
            url: url
        };
    }
}