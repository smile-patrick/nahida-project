const crypto = require('crypto');

const SALT_4X = "xV8v4Qu54lUKrEYFZkJhB8cuOh9Asafs";

function getDS(bodyStr = "", queryStr = "") {
    const t = Math.floor(Date.now() / 1000);
    const r = Math.floor(Math.random() * (200000 - 100001 + 1)) + 100001;
    
    // Sort query if it's provided as an object
    let q = "";
    if (typeof queryStr === 'object' && queryStr !== null) {
        q = Object.keys(queryStr)
            .sort()
            .map(k => `${k}=${queryStr[k]}`)
            .join('&');
    } else if (typeof queryStr === 'string' && queryStr) {
        q = queryStr.split('&').sort().join('&');
    }
    
    // Stringify body if it's an object
    let b = "";
    if (typeof bodyStr === 'object' && bodyStr !== null) {
        b = JSON.stringify(bodyStr);
    } else if (typeof bodyStr === 'string') {
        b = bodyStr;
    }

    const sign_str = `salt=${SALT_4X}&t=${t}&r=${r}&b=${b}&q=${q}`;
    const sign = crypto.createHash('md5').update(sign_str).digest('hex');
    return `${t},${r},${sign}`;
}

function buildApiCookie(rawCookie) {
    // Basic extraction, assumes the raw cookie is directly passed or cleaned up
    return rawCookie;
}

function getHeaders(cookieStr, ds, deviceFp = "38d7f637a7e99", deviceId = "259FFA32-1FCB-4D9B-AD05-89F032883CA1") {
    return {
        "Host": "api-takumi-record.mihoyo.com",
        "User-Agent": "Mozilla/5.0 (Linux; Android 14; 23127PN0CC) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.6099.210 Mobile Safari/537.36 miHoYoBBS/2.102.1",
        "Referer": "https://webstatic.mihoyo.com/app/community-game-records/index.html",
        "Origin": "https://webstatic.mihoyo.com",
        "x-rpc-app_version": "2.102.1",
        "x-rpc-client_type": "5",
        "x-rpc-device_fp": deviceFp,
        "x-rpc-device_id": deviceId,
        "x-rpc-device_name": "NahidaKit",
        "x-rpc-sys_version": "14",
        "Accept": "application/json, text/plain, */*",
        "Content-Type": "application/json;charset=utf-8",
        "Cookie": cookieStr,
        "DS": ds
    };
}

module.exports = { getDS, buildApiCookie, getHeaders };
