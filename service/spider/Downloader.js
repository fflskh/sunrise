class Downloader {
    constructor () {
        this.active = [];
        this.maxActive = 10;
    }

    pushActive (url) {
        this.active.push(url);
    }

    popActive (url) {
        for(let i=0; i<this.active.length; i++) {
            if(this.active[i] === url) {
                this.active.splice(i, 1);
            }
        }
    }

    async download(requestOptions) {
        this.pushActive(requestOptions.url);
        if(this.active.length > this.maxActive) {
            throw new Error('exceed the max active downloads');
        }

        let response = await _utils.request(requestOptions);

        this.popActive(requestOptions.url);

        return response;
    }
}

module.exports = Downloader;

