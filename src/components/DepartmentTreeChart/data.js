export const mockData = {
  name: 'CEO',
  children: [
    {
      name: 'Manager',
      attributes: {
        department: 'Production',
      },
      children: [
        {
          name: 'Foreman',
          attributes: {
            department: 'Fabrication',
          },
          children: [
            {
              name: 'Workers',
            },
          ],
        },
        {
          name: 'Foreman',
          attributes: {
            department: 'Assembly',
          },
          children: [
            {
              name: 'Workers',
            },
          ],
        },
      ],
    },
    {
      name: 'Manager',
      attributes: {
        department: 'Marketing',
      },
      children: [
        {
          name: 'Sales Officer',
          attributes: {
            department: 'A',
          },
          children: [
            {
              name: 'Salespeople',
            },
          ],
        },
        {
          name: 'Sales Officer',
          attributes: {
            department: 'B',
          },
          children: [
            {
              name: 'Salespeople',
            },
          ],
        },
      ],
    },
  ],
}
