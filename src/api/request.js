import axios from 'axios'
import { Message } from 'element-ui'
//request是用axios二次封装的，方便使用。
// import { Message } from 'element-ui'//引入这个的目的是提示访问延迟或者访问出错的提示，但是在这里并没有引入elUI的插件，所以注释掉了，但是在真实开发环境中，需要一个组件来提示访问出错的提示信息。
// import store from '@/store' //ZZX这是VUEX的东西，在这里的作用一般是存贮登录的状态码、
// import { getToken } from '@/utils/auth'// 这里token值用来监控 你的登录状态，存储到本地。
// 序列化对象用的
import qs from 'qs'
// create an axios instance
// 如果存在登录,用于携带cookies信息
axios.defaults.withCredentials = true;
axios.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
// ajax的原生封装
const service = axios.create({
    timeout: 8000 // request timeout 8秒之内 无响应 响应超时。
})

// request interceptor
//请求发送之前触发
service.interceptors.request.use(config => {
    // Do something before request is sent
    // if (store.getters.token) {
    //   // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
    //   config.headers['X-Token'] = getToken()
    // }
    return config
}, error => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
})

// respone interceptor
//请求响应之后怎么办
service.interceptors.response.use(
        response => response,
        /**
         * 下面的注释为通过在response里，自定义code来标示请求状态
         * 当code返回如下情况则说明权限有问题，登出并返回到登录页
         * 如想通过xmlhttprequest来状态码标识 逻辑可写在下面error中
         * 以下代码均为样例，请结合自生需求加以修改，若不需要，则可删除
         */
        response => {
          const res = response.data
          if (res.code !== 20000) {
            Message({
              message: res.message,
              type: 'error',
              duration: 5 * 1000
            })
            // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
            if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
              // 请自行在引入 MessageBox
              // import { Message, MessageBox } from 'element-ui'
              MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
                confirmButtonText: '重新登录',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                store.dispatch('FedLogOut').then(() => {
                  location.reload() // 为了重新实例化vue-router对象 避免bug
                })
              })
            }
            return Promise.reject('error')
          } else {
            return response.data
          }
        },
        error => {
            console.log('err' + error) // for debug
                Message({
                  message: error.message,
                  type: 'error',
                  duration: 5 * 8000
                })
            return Promise.reject(error)
        })
    // {
    // 	method:'get',
    // 	url:'/api/admin/kind/list',
    // 	data
    // }
    // get params
    // post data

function http(config) {
    // 在axios中 对get和post请求处理参数的方式不同
    if (config.method === 'post') {
        config.data = qs.stringify(config.data, { arrayFormat: 'repeat', allowDots: true });
    } else {
        config.params = config.data;
    }
    return service(config);
}


export default http;
// export default service