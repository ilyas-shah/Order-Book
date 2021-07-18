/* eslint-disable react/prop-types */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import Shimmer from 'react-native-shimmer';

const OrderBookItem = (props) => {
  const { dataKey, type = '' } = props;
  const ask = useSelector((state) => {
    return state?.orderBook?.book?.asks[dataKey];
  });
  const bid = useSelector((state) => {
    return state?.orderBook?.book?.bids[dataKey];
  });

  return (
    <View style={styles.OrderBookItem}>
      {type === 'ask' ? (
        ask ? (
          ask.amount ? (
            <>
              <Text>{Math.abs(ask?.amount.toFixed(4))}</Text>
              <Text>{ask?.price}</Text>
            </>
          ) : null
        ) : (
          <Shimmer>
            <Text>Loading...</Text>
          </Shimmer>
        )
      ) : bid ? (
        bid.amount ? (
          <>
            <Text>{bid?.price}</Text>
            <Text>{Math.abs(bid?.amount?.toFixed(4))}</Text>
          </>
        ) : null
      ) : (
        <Shimmer>
          <Text>Loading...</Text>
        </Shimmer>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  OrderBookItem: {
    flex: 1,
    flexDirection: 'row',
    height: 15,
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 5,
    borderBottomWidth: 2,
  },
});
export { OrderBookItem };
