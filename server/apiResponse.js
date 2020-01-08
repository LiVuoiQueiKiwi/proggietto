'use strict';

class ApiResponse {

    constructor() {
        this.success = false;
        this.content = {};
        this.message = '';
    }

    setSuccess() {
        this.success = true;
    }

    unsetSuccess() {
        this.success = false;
    }

    isSuccessful() {
        return this.success;
    }
}

module.exports = ApiResponse;
