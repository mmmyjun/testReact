//引入mockjs
import Mock from 'mockjs'
Mock.mock('/api/v1/get/tabledata', {
    "data": [
        {
            id: 1614315412540,
            basename: '标题11',
            content: '报告这',
            time: '2021-02-23 13:05:30'
        },
        {
            id: 1614315412542,
            basename: '标题222',
            content: '256',
            time: '2021-02-24 13:05:32'
        },
        {
            id: 1614315412543,
            basename: '标题333',
            content: '345',
            time: '2021-02-25 13:05:39'
        },
        {
            id: 1614315412544,
            basename: '444444',
            content: 'ddddddddde',
            time: '2021-02-26 13:05:37'
        },
        {
            id: 1614315412545,
            basename: '5555',
            content: 'eeee',
            time: '2021-02-26 16:09:56'
        }
    ]
});