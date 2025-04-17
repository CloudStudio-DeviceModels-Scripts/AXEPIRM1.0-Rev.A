function parseUplink(device, payload) {
    var bytes = payload.asBytes();
    env.log('Data cruda en bytes: ', bytes)
    var decoded = {};

    for (var i = 0; i < bytes.length; ) {
        var channel_id = bytes[i++];
        var channel_type = bytes[i++];
        // BATTERY
        if (channel_id === 0x01 && channel_type === 0x75) {
            decoded.battery = bytes[i];
            i += 1;
        }
        // PIR
        else if (channel_id === 0x03 && channel_type === 0x00) {
            decoded.pir = bytes[i] === 0 ? 0 : 1;
            i += 1;
        }
        // DAYLIGHT
        else if (channel_id === 0x04 && channel_type === 0x00) {
            decoded.daylight = bytes[i] === 0 ? 1 : 0;
            i += 1;
        } else {
            break;
        }
    }
    env.log('Data parseada: ', decoded);
    
    if (decoded.battery != null) {
        var e = device.endpoints.byAddress("1");
        if (e != null) {
            env.log('Bateria: ', decoded.battery);
            e.updateGenericSensorStatus(decoded.battery);
        }
    }

    if (decoded.pir != null) {
        var pir_int = parseInt(decoded.pir);
        var e = device.endpoints.byAddress("2");
        if (e != null) {
            env.log('PIR: ', pir_int);
            e.updateGenericSensorStatus(pir_int);
        }
    }

    if (decoded.daylight != null) {
        var daylight_int = parseInt(decoded.daylight);
        var e = device.endpoints.byAddress("3");
        if (e != null) {
            env.log('Daylight: ', daylight_int)
            e.updateGenericSensorStatus(daylight_int);
        }
    }
}