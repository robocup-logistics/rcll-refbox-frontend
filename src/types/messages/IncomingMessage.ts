import type ClipsMessage from '@/types/messages/incoming/ClipsMessage'
import type MessageToDisplay from '@/types/messages/incoming/MessageToDisplay'

type IncomingMessage = ClipsMessage | MessageToDisplay
export default IncomingMessage
