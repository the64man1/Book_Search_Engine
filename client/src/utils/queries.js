import { gql } from '@apollo/client';

export const GET_ME = gql`
    {
        me {
            _id
            username
            email
            bookCount
            savedBooks {
                description
                title
                bookId
                image
                link
                authors
            }
        }
    }
`;