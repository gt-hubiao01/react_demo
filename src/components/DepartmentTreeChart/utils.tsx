const setInitialCollapsed = (node: any, depth: number) => {
  const newNode = { ...node }
  // newNode.__rd3t = {
  //   collapsed: depth <= 1 ? false : true,
  // }
  newNode.collapsed = depth <= 1 ? false : true

  if (newNode.children) {
    newNode.children = newNode.children.map((child: any) =>
      setInitialCollapsed(child, depth + 1)
    )
  }

  return newNode
}

export const getInitialTree = (data: any) => {
  const afterCollapsed = setInitialCollapsed(data, 1)
  return afterCollapsed
}

export const setCollapsedNode = (data: any, name: string) => {
  const newNode = { ...data }
  if (newNode.name === name) {
    newNode.collapsed = !newNode.collapsed
  } else if (newNode.children) {
    newNode.children = newNode.children.map((child: any) =>
      setCollapsedNode(child, name)
    )
  }

  return newNode
}

export const getCollapsedTree = (data: any, name: string) => {
  const afterCollapsed = setCollapsedNode(data, name)
  return afterCollapsed
}
