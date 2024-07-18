const defaultPageConfig = [
  {
    title: '团队数量',
    config: [
      {
        title: '当前在职员工数',
        key: 'currentEmployee',
        metrics: [],
        tag: '',
        ... // 其他配置
  
        subCards: [
          {
            title: '当前待入职人数',
            key: 'currentToBeHired',
            ... // 其他配置
          }
        ]
      },
      {
        ... // 第二块配置，如累计离职率
      }
    ]

  }, {
    title: '团队结构',
    config: [
      {
        title: '当前老新员工比',
        key: 'currentOldNewEmployee',
        ... // 其他配置
      },
      ...

    ]
  }
]