wrapTemplateElements = (platform, trains) => {
    console.log(platform);
    if (platform == 'line') {
        return _buildLineTemplateElements(trains);
    } else {
        return _buildFBTemplateElments(trains);
    }
}

_buildFBTemplateElments = (trains) => {
    const elements = trains.map( (train) => {
        return {
            image_url: 'https://s7d5.turboimg.net/t1/36657726_train_Cropped.png',
            title: `${train.StartStation} To ${train.EndStation} (No.${train.TrainNo})`,
            subtitle: `${train.DepartureTime} - ${train.ArrivalTime}`
        }
    });
    return elements;
}

_buildLineTemplateElements = (trains) => {
    const elements = trains.map( (train) => {
        return {
            thumbnailImageUrl: 'https://example.com/bot/images/item1.jpg',
            title: `${train.StartStation} To ${train.EndStation} (No.${train.TrainNo})`,
            text: `${train.DepartureTime} - ${train.ArrivalTime}`
        }
    });
    return elements;
}

const MsgWrapper = {
    wrapTemplateElements
}

module.exports = MsgWrapper;
