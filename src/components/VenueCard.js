import {View, Text, Image, StyleSheet} from 'react-native';
import React from 'react';
import FastImage from 'react-native-fast-image';

const VenueCard = ({
  id,
  thumbnail,
  name,
  average_rating,
  address,
  itemWidth,
}) => {
  return (
    <View
      key={id}
      style={[
        styles.cardView,
        {
          width: itemWidth,
        },
      ]}>
      <View style={styles.thumbnailView}>
        <FastImage
          defaultSource={require('../assets/placeholderImage.png')}
          source={{
            uri: thumbnail,
            priority: FastImage.priority.high,
          }}
          style={styles.thumbnail}
          resizeMode="cover"
        />
      </View>
      <View style={styles.contentView}>
        <View style={styles.nameAndRatingView}>
          <View style={styles.nameView}>
            <Text numberOfLines={1} style={styles.nameText}>
              {name}
            </Text>
          </View>
          <View style={styles.ratingView}>
            <Text style={styles.ratingText}>{average_rating}</Text>
            <Image
              source={require('../assets/star.png')}
              resizeMode="contain"
              style={styles.ratingImage}
            />
          </View>
        </View>
        <Text numberOfLines={2} style={styles.addressText}>
          {address}
        </Text>
      </View>
    </View>
  );
};

export default VenueCard;

const styles = StyleSheet.create({
  cardView: {
    backgroundColor: '#f7f7f7',
    marginHorizontal: 5,
  },
  thumbnailView: {
    backgroundColor: 'black',
    padding: 2,
  },
  thumbnail: {
    height: 115,
    width: '100%',
    padding: 2,
  },
  contentView: {
    paddingHorizontal: 5,
  },
  nameAndRatingView: {
    flexDirection: 'row',
    flex: 1,
  },
  nameView: {
    flex: 8.5,
  },
  nameText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  ratingView: {
    flex: 1.5,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 12,
    color: 'black',
  },
  ratingImage: {
    height: 12,
    width: 12,
    marginLeft: 5,
  },
  addressText: {
    fontSize: 13,
    color: 'black',
  },
});
