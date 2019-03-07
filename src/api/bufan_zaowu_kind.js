import request from './request'
function getKindList(data){
    return request({
        method:'get',
        url:'api/admin/kind/list',
        data
    })
}
function addKind(data){
    return request({
        method:'post',
        url:'api/admin/kind/save',
        data
    })
}
function delKind(data){
    return request({
        method:'get',
        url:'api/admin/kind/del',
        data
    })
}
function editKind(data){
    return request({
        method:'post',
        url:'api/admin/kind/update',
        data
    })
}
// function stockList(data){
//     return request({
//         method: 'get',
//         url: 'api/admin/goods/stockList',
//         data
//     })
// }
export default ({
    getKindList,
    addKind,
    delKind,
    editKind,
    // stockList
})