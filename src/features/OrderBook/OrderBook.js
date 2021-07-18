import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import { updateAsks, updateBids, updateAsk, updateBid, toggleLoading } from './orderBookSlice';
import { OrderBookItem } from './OrderBookItem';

const WEBSOCKET_URL = 'wss://api-pub.bitfinex.com/ws/2';
const CHANNEL_NAME = 'books';
let CHANNEL_ID = 0;

export const OrderBookScreen = () => {
  const [precision, setPrecision] = useState('P0');
  const [connecting, setConnecting] = useState(true);
  const dispatch = useDispatch();

  const defaultMsg = JSON.stringify({
    event: 'subscribe',
    channel: 'book',
    symbol: 'tBTCUSD',
    len: 25,
    prec: 'P0',
    chanId: CHANNEL_ID,
  });
  const asks = useSelector((state) => {
    return state?.orderBook?.book?.asks || {};
  });
  const bids = useSelector((state) => {
    return state?.orderBook?.book?.bids || {};
  });
  const loading = useSelector((state) => state?.orderBook?.loading);

  const normalize = (data = []) => {
    let container = {};
    // From [123, 1, 1.11]
    // TO { "123": { 123, 1, 1.11 } }
    data.forEach((element, index) => {
      container[element[0]] = {
        price: element[0],
        count: element[1],
        amount: element[2],
      };
    });
    return container;
  };

  const handleMessage = (msg) => {
    msg = JSON.parse(msg?.data);
    if (msg.event || msg[1] === 'hb') return;

    /**
     * 
      when count > 0 then you have to add or update the price level
      3.1 if amount > 0 then add/update bids
      3.2 if amount < 0 then add/update asks
      when count = 0 then you have to delete the price level.
      4.1 if amount = 1 then remove from bids
      4.2 if amount = -1 then remove from asks
     */
    const data = msg[1] || [];

    if (data.length === 50) {
      dispatch(toggleLoading(true));
      const bids = data.filter((item) => {
        const amount = item[2];
        const count = item[1];

        return count > 0 && amount > 0;
      });
      const asks = data.filter((item) => {
        const amount = item[2];
        const count = item[1];

        return count > 0 && amount < 0;
      });

      const nmBids = normalize(bids);
      const nmAsks = normalize(asks);

      dispatch(updateAsks(nmAsks));
      dispatch(updateBids(nmBids));
      dispatch(toggleLoading(false));
    } else {
      const amount = data[2];
      const count = data[1];

      if (count > 0 && amount > 0) {
        dispatch(
          updateBid({
            key: data[0],
            value: {
              price: data[0],
              count: data[1],
              amount: data[2],
            },
          })
        );
      } else if (count > 0 && amount < 0) {
        dispatch(
          updateAsk({
            key: data[0],
            value: {
              price: data[0],
              count: data[1],
              amount: data[2],
            },
          })
        );
      }
    }
  };

  const connect = (msg = defaultMsg) => {
    setConnecting(true);
    const ws = new WebSocket(WEBSOCKET_URL);
    ws.onopen = () => {
      setConnecting(false);
      ws.send(msg);
    };

    ws.onmessage = handleMessage;
  };

  useEffect(() => {
    connect();
  }, []);

  return (
    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
      {!connecting && loading ? (
        <Text>{'loading...'}</Text>
      ) : connecting ? (
        <Text>Connecting...</Text>
      ) : (
        <>
          {/* Asks List */}
          <View style={styles.orderListContainer}>
            <View style={styles.orderItemContainer}>
              <View style={styles.orderItem}>
                <Text style={{ fontWeight: 'bold' }}>TOTAL</Text>
                <Text style={{ fontWeight: 'bold' }}>PRICE</Text>
              </View>
              {Object.keys(asks).map((key, index) => {
                // display only 10 items
                return index < 10 ? <OrderBookItem key={key} dataKey={key} type="ask" /> : null;
              })}
            </View>
          </View>
          {/* Bids List */}
          <View style={styles.orderListContainer}>
            <View style={styles.orderItemContainer}>
              <View style={styles.orderItem}>
                <Text style={{ fontWeight: 'bold' }}>PRICE</Text>
                <Text style={{ fontWeight: 'bold' }}>TOTAL</Text>
              </View>
              {Object.keys(bids).map((key, index) => {
                // display only 10 items
                return index < 10 ? <OrderBookItem key={key} dataKey={key} type="bid" /> : null;
              })}
            </View>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  orderListContainer: {
    flex: 1,
    borderWidth: 2,
    width: 100,
  },
  orderItemContainer: {
    flex: 1,
    width: '100%',
  },
  orderItem: {
    flex: 1,
    flexDirection: 'row',
    height: 10,
    width: '100%',
    alignSelf: 'center',
    justifyContent: 'space-between',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderBottomWidth: 2,
  },
});
