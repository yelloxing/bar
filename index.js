import { isArray } from '@hai2007/tool/type';

/**
 * 柱状图
 */

var initConfig = function (attr, that) {

    if (attr.x == null) attr.x = 0;
    if (attr.y == null) attr.y = 0;
    if (attr.width == null) attr.width = that._width;
    if (attr.height == null) attr.height = that._height;

    // 求最值并校对数据格式
    var dataArray = [], maxValue = null, minValue = null;
    for (var i = 0; i < attr.data.length; i++) {
        if (isArray(attr.data[i])) {
            var temp = [];
            for (var j = 0; j < attr.data[i].length; j++) {
                if (maxValue == null || maxValue < attr.data[i][j]) maxValue = attr.data[i][j];
                if (minValue == null || minValue > attr.data[i][j]) minValue = attr.data[i][j];
                temp.push(attr.data[i][j]);
            }
            dataArray.push(temp);
        } else {
            if (maxValue == null || maxValue < attr.data[i]) maxValue = attr.data[i];
            if (minValue == null || minValue > attr.data[i]) minValue = attr.data[i];
            dataArray.push([attr.data[i]]);
        }
    }

    // 登记最终和数据
    attr.data = dataArray;
    if (attr["max-value"] == null) attr["max-value"] = maxValue;
    if (attr["min-value"] == null) attr["min-value"] = minValue;

};

export default ['number', 'string', 'json', '$ruler', '$getLoopColors', function ($number, $string, $json, $ruler, $getLoopColors) {
    return {
        attrs: {

            // 图形绘制的区域
            x: $number(null)(true),
            y: $number(null)(true),
            width: $number(null)(true),
            height: $number(null)(true),

            // 数据
            // [1,2,3,...]
            // [[1,2,3],[1,2,3],[1,2,3],...]
            data: $json(),

            // 类型
            type: $string('normal'),// normal 或 circle

            // 颜色
            colors: $json(null),

            // 刻度尺数据
            ruler: $json(),

            // 最值
            "max-value": $number(null)(true),
            "min-value": $number(null)(true)

        },
        region: {
            default: function (render, attr) {
                initConfig(attr, this);

            }
        },
        link: function (painter, attr) {
            initConfig(attr, this);

            var ruler = $ruler(attr['max-value'], attr['min-value'], 5);

            // 校对颜色
            if (attr.colors == null) attr.colors = isArray(attr.data[0]) ? $getLoopColors(attr.data[0].length) : $getLoopColors(1);

            // 先绘制刻度尺
            if (attr.type == 'circle') {

                var radiusValue = (attr.width > attr.height ? attr.height : attr.width) * 0.5 - 50;

                // 圆形刻度尺
                this.$reuseSeriesLink('polar-ruler', {
                    attr: {
                        cx: attr.x + attr.width * 0.5,
                        cy: attr.y + attr.height * 0.5,
                        radius: radiusValue,
                        value: attr.ruler,
                        begin: -Math.PI * 0.5,
                        "value-position": 'between'
                    }
                });

                // 垂直刻度尺
                this.$reuseSeriesLink('ruler', {
                    attr: {
                        x: attr.x + attr.width * 0.5,
                        y: attr.y + attr.height * 0.5,
                        length: radiusValue,
                        value: ruler.ruler,
                        direction: "BT",
                        "mark-direction": "left"
                    }
                });

            } else {

                // Y刻度尺
                this.$reuseSeriesLink('ruler', {
                    attr: {
                        x: attr.x + 50,
                        y: attr.y + attr.height - 50,
                        length: attr.width - 100,
                        value: attr.ruler,
                        "value-position": 'between'
                    }
                });

                // X刻度尺
                this.$reuseSeriesLink('ruler', {
                    attr: {
                        x: attr.x + 50,
                        y: attr.y + attr.height - 50,
                        length: attr.height - 100,
                        value: ruler.ruler,
                        direction: "BT",
                        "mark-direction": "left"
                    }
                });

            }

        }
    };
}];
