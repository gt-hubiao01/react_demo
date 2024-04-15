import React from 'react'
import { Tooltip } from 'antd'
import { formatNumber } from '@/utils/formatNumber'
import { QuestionCircleOutlined } from '@ant-design/icons'

export type LabelMapType = {
  key: string
  value: string
  children: {
    key: string
    value: string
    fieldUnit?: string
    formatter?: (num: number) => string
  }[]
}[]

// 添加单位，数据转化的逻辑
export function labelTransfer<T>({
  dataInfo,
  labelMap,
  tooltipMap,
  availableList,
}: {
  dataInfo: T
  labelMap: LabelMapType
  availableList: string[]
  tooltipMap: Record<string, string>
}) {
  return {
    extract(prefix: (keyof T)[]) {
      return prefix.reduce((acc, p) => {
        const data = dataInfo[p]
        const children = labelMap.find((item) => item.key === p)?.children || []

        return {
          ...acc,
          [p]: {
            title: labelMap.find((item) => item.key === p)?.value || '',
            items: children
              .filter(({ key }) => availableList.includes(key))
              .map(({ key, value: title, fieldUnit, formatter }) => {
                const raw = data[key as keyof typeof data]
                const titleElement = tooltipMap[key] ? (
                  <Tooltip title={tooltipMap[key]}>
                    <QuestionCircleOutlined
                      style={{
                        fontSize: '12px',
                        verticalAlign: 'middle',
                        marginTop: '-2px',
                      }}
                    />
                    <span style={{ paddingLeft: 4 }}>{title}</span>
                  </Tooltip>
                ) : (
                  title
                )

                if (typeof raw === 'number') {
                  if (formatter) {
                    return {
                      title: titleElement,
                      value: formatter(raw),
                    }
                  } else {
                    const value = formatNumber(raw)
                    return {
                      title: titleElement,
                      value: `${value}${fieldUnit || ''}`,
                    }
                  }
                }

                return {
                  title: titleElement,
                  value: '--',
                }
              })
              .filter(({ value }) => value !== undefined),
          },
        }
      }, {} as Record<keyof T, { title: string; items: { title: React.ReactNode; value: string }[] }>)
    },
  }
}
