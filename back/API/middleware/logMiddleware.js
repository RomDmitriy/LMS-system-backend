export function logger(req, res) {
    // красивый log
    let request_path = '\'' + req.method + ':' + req.baseUrl + req.path;
    if (request_path.slice(-1) === '/') {
        request_path += '\'';
    } else {
        request_path += '/\'';
    }

    request_path = request_path.padEnd(55);

    console.log(
        get_current_time()
            + ' UTC'
            + '\t'
            + request_path
            + ' Status: '
            + res.statusCode,
    );
}

function get_current_time() {
    let res = ''; // result variable
    const data = new Date(); // init date
    const hh = data.getUTCHours(); // set UTC hours
    const mm = data.getUTCMinutes(); // set UTC minutes
    const ss = data.getUTCSeconds(); // set UTC seconds

    if (hh < 10) {
        // making hours more readable
        res += '0';
    }

    res += hh + ':';

    if (mm < 10) {
        // making minutes more readable
        res += '0';
    }

    res += mm + ':';

    if (ss < 10) {
        // making seconds more readable
        res += '0';
    }

    res += ss;

    return res; // return time in formatted string
}
