import { gql } from '@apollo/client';

export const CREATE_NEW_USER = gql`
mutation createUser($username: String!, $email: String!, $password: String!) {
  addUser(username: $username, email: $email, password: $password) {
    token
    user {
      _id
      email
      username
    }
  }
}`;

export const LOGIN_USER = gql`
mutation login($username: String!, $password: String!) {
  loginUser(username: $username, password: $password) {
    token
    user {
      _id
      email
      username
    }
  }
}`;

export const UPDATE_USER_NO_PASSWORD = gql`
mutation updateMe($username: String, $email: String) {
  updateUser(username: $username, email: $email) {
    _id
    email
    username
  }
}`;

export const DELETE_USER = gql`
mutation DeleteUser {
  deleteUser {
    _id
    username
    role
    email
    lists {
      _id
      productCount
      name
      isDefault
      products {
        _id
      }
    }
  }
}`;


export const CREATE_NEW_LIST = gql`
mutation createList($name: String!, $isDefault:Boolean) {
  addList(name: $name, isDefault: $isDefault) {
    _id
    isDefault
    name
    productCount
    itemCount
    products {
      _id
      isCompleted
      notes
      quantity
      product {
        productAlias
        _id
        productData {
          barcode
          name
        }
      }
    }
  }
}`;

export const UPDATE_LIST = gql`
mutation updateMyList($listId: ID!, $name: String, $isDefault: Boolean) {
  updateList(listId: $listId, name: $name, isDefault: $isDefault) {
    _id
    isDefault
    name
    productCount
    itemCount
    products {
      _id
    }
  }
}`;

export const DELETE_LIST = gql`
mutation removeMyList($listId: ID!) {
  removeList(listId: $listId) {
    _id
    isDefault
    name
    productCount
    itemCount
    products {
      _id
    }
  }
}`;

export const ADD_BARCODE_TO_LIST = gql`
mutation addBarcodeToList($listId: ID!, $barcode: String!, $quantity: Int!, $isCompleted: Boolean!) {
  addToList(listId: $listId, barcode: $barcode, quantity: $quantity, isCompleted: $isCompleted) {
    _id
    isCompleted
    notes
    quantity
    product {
      _id
      productAlias
      productData {
        barcode
        name
      }
    }
  }
}`;

export const REMOVE_ITEM_FROM_LIST = gql`
mutation removeItemFromList($listItemId: ID!, $listId: ID!) {
  removeFromList(listItemId: $listItemId, listId: $listId) {
    _id
    isCompleted
    notes
    quantity
    product {
      _id
      productAlias
      productData {
        barcode
        name
      }
    }
  }
}`;

export const UPDATE_LIST_ITEM = gql`
mutation updateItem($listItemId: ID!, $notes: String, $quantity: Int, $isCompleted: Boolean) {
  updateListItem(listItemId: $listItemId, notes: $notes, quantity: $quantity, isCompleted: $isCompleted) {
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

export const ADD_BARCODE_TO_DEFAULT_LIST = gql`
mutation addItemToDefaultList($barcode: String!) {
  addItemToDefaultList(barcode: $barcode) {
    _id
    isCompleted
    listId
    notes
    quantity
    product {
      _id
      productAlias
      productData {
        barcode
        name
      }
    }
  }
}`;
