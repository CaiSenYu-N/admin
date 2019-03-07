import request from './request'

function getGoodsList(data){
    return request({
        methods: 'get',
        url: 'api/admin/goods/list',
        data
    })
}

function addTwo(data){
    return request({
        methods: 'get',
        url: 'api/admin/goods/stockList',
        data
    })
}

function goodsSave(data){
    return request({
        methods: 'post',
        url: 'api/admin/goods/save',
        data
    })
}

export default ({
    getGoodsList,
    addTwo,
    goodsSave
})