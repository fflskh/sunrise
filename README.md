# sunrise
The Sun Rises Every Day!

## Response
- 接口始终返回JSON格式的数据；
- response status code说明：
    - 200，响应正常
    - 5xx，服务异常
- response格式如下：
    - request: 非production环境下显示
        - method: 'GET/POST/PUT/DELETE'，
        - href: '',
        - headers: '',
        - body: ''
    - meta:
        - "x-server-current-time": 服务器时间
        - code: '' // 200-正常，4xx-Bad Request，5xx-Server Error,
        - error:
            - code: 每类error都有一个code，方便问题的定位
            - message: error message
            - data: 附带error的一些错误信息
            - stack: error错误栈信息，非production环境下显示
    - response: //返回格式由具体的接口决定

