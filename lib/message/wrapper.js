wrapTemplateElements = (platform, trains) => {
    if (platform == 'line') {
        return _buildLineTemplateElements(trains);
    } else {
        return _buildFBTemplateElments(trains);
    }
}

_buildFBTemplateElments = (trains) => {
    // the elements limit is 10
    const elements = trains.slice(0, 10).map( (train) => {
        return {
            image_url: 'https://s7d5.turboimg.net/t1/36657726_train_Cropped.png',
            title: `${train.StartStation} To ${train.EndStation} (No.${train.TrainNo})`,
            subtitle: `${train.DepartureTime} - ${train.ArrivalTime}`
        }
    });
    return elements;
}

_buildLineTemplateElements = (trains) => {
    // the elements limit is 10
    const elements = trains.slice(0, 10).map( (train) => {
        return {
            thumbnailImageUrl: 'https://s7d5.turboimg.net/t1/36657726_train_Cropped.png',
            title: `${train.StartStation} To ${train.EndStation} (No.${train.TrainNo})`,
            text: `${train.DepartureTime} - ${train.ArrivalTime}`,
            actions: [{ 
                type: 'uri',
                label: `前往購票`,
                uri: 'https://irs.thsrc.com.tw/IMINT'
            }]

        }
    });
    return elements;
}

const MsgWrapper = {
    wrapTemplateElements
}

module.exports = MsgWrapper;
