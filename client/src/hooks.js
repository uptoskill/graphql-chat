import { useQuery, useMutation, useSubscription } from '@apollo/client';
import { addMessageMutation, messageAddedSubscription, messagesQuery } from './graphql/queries';

export function useChatMessages() {
  const {data} = useQuery(messagesQuery);
  const messages = data ? data.messages : [];
  useSubscription(messageAddedSubscription, {
    onSubscriptionData: ({client, subscriptionData}) => {
      client.writeQuery({
        query: messagesQuery,
        data: {
          messages: messages.concat(subscriptionData.data.messageAdded)
        }
      });
    }
  });
  const [addMessage] = useMutation(addMessageMutation);
  return {
    messages,
    addMessage: (text) => addMessage({variables: {input: {text}}})
  };
}
