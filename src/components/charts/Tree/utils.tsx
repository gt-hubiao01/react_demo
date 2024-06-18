export const getAllInitialKeys = (data: any, idKey: string) => {
  const keys: string[] = [];

  const findKeys = (node: any) => {
    if (node.children && node.children.length > 0) {
      keys.push(node[idKey]);
    }

    if (node.children) {
      node.children.forEach((child: any) => findKeys(child));
    }
  };

  findKeys(data);

  return keys;
};
