import type AttentionMessage from '@/types/messages/incoming/AttentionMessage'
import type InfoMessage from '@/types/messages/incoming/InfoMessage'

type MessageToDisplay = AttentionMessage | InfoMessage
export default MessageToDisplay
