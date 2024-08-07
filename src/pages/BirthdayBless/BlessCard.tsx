import { CSSProperties } from 'react'
import styles from './index.module.less'

export type BlessCardType = {
  backGroundUrl: string // 中文字段名: 贺卡背景图链接; 类型: string; 备注: 字段说明：贺卡背景图链接;
  content: string // 中文字段名: 贺卡内容; 类型: string; 备注: 字段说明：贺卡内容;
  cardUrl: string // 中文字段名: 贺卡链接; 类型: string; 备注: 字段说明：贺卡链接;
  cardId: number // 中文字段名: 贺卡id; 类型: long; 备注: 字段说明：贺卡id;
  sender: string // 中文字段名: 发送人; 类型: string; 备注: 字段说明：发送人;
  receiver: string // 中文字段名: 接收人; 类型: string; 备注: 字段说明：接收人;
  senderRole: string // 中文字段名: 发送人的角色; 类型: string; 备注: 字段说明：发送人的角色;
  extraValue?: Record<string, any>
}

const BlessCard = (props: BlessCardType) => {
  const { backGroundUrl, content, sender, cardUrl } = props


  return (
    <div className={styles.blessCardContainer}>
      {/* 待定，替换为添加了祝福词的贺卡组件 */}
      <div
        className={styles.blessCard}
        style={{ '--background-url': `url(${backGroundUrl})` } as CSSProperties}
      >
        {content}
      </div>
      <div className={styles.sender}>来自 {sender}</div>
      <div className={styles.subTitle}>开心工作，幸福生活!</div>
    </div>
  )
}

export default BlessCard
