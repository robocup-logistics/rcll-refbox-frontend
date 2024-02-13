import type AttentionMessage from '@/types/messages/incoming/AttentionMessage'
import type InfoMessage from '@/types/messages/incoming/InfoMessage'

// LOGMESSAGE  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// log messages are messages that are just printed to the log and not further
// processed. Based on their attributes, we can differentiate between these two
// types.
type LogMessage = AttentionMessage | InfoMessage
export default LogMessage
