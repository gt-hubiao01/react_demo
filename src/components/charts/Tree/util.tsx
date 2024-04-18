import foldIcon from '@/assets/fold.svg'
import unfoldIcon from '@/assets/unfold.svg'

const setInitialCollapsed = (node: any, depth: number) => {
  const newNode = { ...node }
  newNode.collapsed = depth <= 1 ? false : true

  if (newNode.children) {
    newNode.children = newNode.children.map((child: any) =>
      setInitialCollapsed(child, depth + 1)
    )
  }

  return newNode
}

const setInitialLabel = (node: any) => {
  const newNode = { ...node }
  newNode.label = {
    formatter: (params: any) => {
      return [
        `{department|${params.data.department}}{departmentBg|}`,
        `{count|${params.data.leaveCount}}{countBg|}`,
        `{name|${params.name}}{nameBg|}`,
        `{level|${params.data.level}}{levelBg|}`,
      ].join('\n')
    },
    rich: {
      department: {
        align: 'center',
        verticalAlign: 'middle',
        fontSize: 14,
        color: '#fff',
      },
      departmentBg: {
        backgroundColor: {
          type: 'linear',
          x: 0,
          y: 0.5,
          x2: 1,
          y2: 0.5,
          colorStops: [
            {
              offset: 0,
              color: '#FFB44E', // 0% 处的颜色
            },
            {
              offset: 1,
              color: '#FF7575', // 100% 处的颜色
            },
          ],
          global: false,
        },
        borderRadius: [16, 16, 0, 0],
        width: '100%',
        align: 'right',
        height: 30,
        // borderRadius:,
      },
      count: {
        align: 'center',
        verticalAlign: 'middle',
        fontSize: 12,
        color: '#fff',
      },
      countBg: {
        backgroundColor: {
          type: 'linear',
          x: 0,
          y: 0.5,
          x2: 1,
          y2: 0.5,
          colorStops: [
            {
              offset: 0,
              color: '#FFB44E', // 0% 处的颜色
            },
            {
              offset: 1,
              color: '#FF7575', // 100% 处的颜色
            },
          ],
          global: false,
        },
        width: '100%',
        align: 'right',
        height: 25,
      },
      name: {
        align: 'center',
        verticalAlign: 'middle',
        fontSize: 14,
        color: '#333333',
      },
      nameBg: {
        backgroundColor: '#fff',
        width: '100%',
        align: 'right',
        height: 28,
      },
      level: {
        align: 'center',
        verticalAlign: 'middle',
        fontSize: 12,
        color: '#333333',
      },
      levelBg: {
        backgroundColor: '#fff',
        width: '100%',
        align: 'right',
        height: 25,
      },
    },
  }
  newNode.symbol = newNode.collapsed
    ? 'image://' + unfoldIcon
    : 'image://' + foldIcon

  if (newNode.children) {
    newNode.children = newNode.children.map((child: any) =>
      setInitialLabel(child)
    )
  }

  return newNode
}

export const getInitialTree = (data: any) => {
  const afterCollapsed = setInitialCollapsed(data, 1)
  const afterFormatter = setInitialLabel(afterCollapsed)
  return afterFormatter
}

export const getFoldTree = (data: any, name: string) => {
  const newNode = { ...data }
  if (newNode.name === name) {
    newNode.collapsed = !newNode.collapsed
    newNode.symbol = newNode.collapsed
      ? 'image://' + unfoldIcon
      : 'image://' + foldIcon
  } else if (newNode.children) {
    newNode.children = newNode.children.map((child: any) =>
      getFoldTree(child, name)
    )
  }

  return newNode
}

export const getHoverBtnTree = (data: any, name: string) => {
  const newNode = { ...data }
  if (newNode.name === name) {
    newNode.symbolSize = [18, 18]
  } else {
    if (newNode.children) {
      newNode.children = newNode.children.map((child: any) =>
        getHoverBtnTree(child, name)
      )
    }
  }

  return newNode
}

export const getHoverBoxTree = (data: any, name: string) => {
  const newNode = { ...data }
  if (newNode.name === name) {
    newNode.label = {
      ...newNode.label,
      borderColor: 'blue',
    }
  } else if (newNode.children) {
    newNode.children = newNode.children.map((child: any) =>
      getHoverBoxTree(child, name)
    )
  }

  return newNode
}

export const recoverHover = (data: any) => {
  const newNode = { ...data }
  newNode.symbolSize = undefined
  newNode.label = {
    ...newNode.label,
    borderColor: undefined,
  }

  if (newNode.children) {
    newNode.children = newNode.children.map((child: any) => recoverHover(child))
  }

  return newNode
}
