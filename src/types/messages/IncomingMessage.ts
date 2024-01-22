import type ClipsMessage from '@/types/messages/incoming/ClipsMessage'
import type LogMessage from '@/types/messages/incoming/LogMessage'

// INCOMINGMESSAGE - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// there are two basic types of incoming messages - the clips messages that
// contain data that we want to store and process and non-clips messages that we
// just want to print to the log
type IncomingMessage = ClipsMessage | LogMessage
export default IncomingMessage
