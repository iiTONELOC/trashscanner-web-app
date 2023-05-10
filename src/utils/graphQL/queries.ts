import { gql } from '@apollo/client';

export const GET_ME = gql`
query getMe {
  me {
    _id
    username
    email
    lists{
      _id
      name
    }
  }
}`;

export const GET_MY_LISTS = gql`
query getMyLists {
  myLists {
    _id
    isDefault
    name
    productCount
    itemCount
    products {
      _id
      isCompleted
      notes
      product {
        _id
        productData {
          barcode
          name
        }
        productAlias
      }
      quantity
    }
  }
}`;

export const GET_LIST = gql`
query getList($listId: ID!) {
  list(listId: $listId) {
    isDefault
    name
    productCount
    itemCount
    products {
      isCompleted
      _id
      notes
      product {
        productAlias
        productData {
          barcode
          name
        }
        _id
      }
      quantity
    }
  }
}`;

export const GET_LIST_ITEM = gql`
query getListItem($listItemId: ID!) {
  listItem(listItemId: $listItemId) {
    _id
    isCompleted
    listId
    notes
    product {
      _id
      productAlias
      productData {
        barcode
        name
      }
    }
    quantity
  }
}`;
