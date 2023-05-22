import {
  View,
  Text,
  Dimensions,
  ScrollView,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import MapView, {MapMarker} from 'react-native-maps';
import {MakeGetCallWithoutAuthentication} from '../utilities/APICallingMechanics';
import {AppStrings} from '../utilities/AppStrings';
import Toast from 'react-native-toast-message';
import VenueCard from '../components/VenueCard';
import {useSelector, useDispatch} from 'react-redux';
import {updateVenues} from '../redux/VenuesSlice';

const MapViewScreen = () => {
  const {width} = Dimensions.get('window');
  const itemWidth = width - 70;
  const mapRef = useRef();
  const scrollRef = useRef();
  const [currentItem, setCurrentItem] = useState(null);
  const {listOfVenues} = useSelector(state => state?.venues);
  const dispatch = useDispatch();

  const pinColors = [
    'red',
    'yellow',
    'tomato',
    'orange',
    'gold',
    'wheat',
    'linen',
    'tan',
    'green',
    'blue',
    'aqua',
    'violet',
    'indigo',
  ];

  const handleScroll = event => {
    try {
      const scrollX = event.nativeEvent.contentOffset.x;
      const currentItemIndex = Math.floor(scrollX / itemWidth);
      setCurrentItem(listOfVenues[currentItemIndex]);
    } catch (error) {
      console.log(error);
    }
  };

  const scrollToCard = index => {
    try {
      scrollRef?.current.scrollTo({
        x: index * (itemWidth + 10), // 10 is horizontal margin
        animated: true,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const getVenuesFromAPI = async () => {
    let tempVenues = [];
    try {
      dispatch(updateVenues(null));
      const venuesResponse = await MakeGetCallWithoutAuthentication(
        AppStrings.VenuesEndpoint,
      );
      if (
        venuesResponse &&
        venuesResponse.data &&
        venuesResponse.data.results
      ) {
        tempVenues = venuesResponse.data.results;
      } else if (venuesResponse != null) {
        Toast.show({
          type: 'error',
          text1: AppStrings.OopsText,
          text2: AppStrings.GeneralErrorMessage,
        });
      }
    } catch (error) {
      console.log(error);
      Toast.show({
        type: 'error',
        text1: AppStrings.OopsText,
        text2: AppStrings.GeneralErrorMessage,
      });
    } finally {
      dispatch(updateVenues(tempVenues));
    }
  };

  const renderCardItem = (item, index) => {
    return (
      <VenueCard
        key={item.id}
        id={item.id}
        name={item.name}
        average_rating={item.average_rating}
        thumbnail={item.thumbnail}
        address={item.address}
        itemWidth={itemWidth}
      />
    );
  };

  useEffect(() => {
    getVenuesFromAPI();
  }, []);

  useEffect(() => {
    if (currentItem && currentItem.name) {
      mapRef?.current.animateToRegion(
        {
          latitude: currentItem.lat,
          longitude: currentItem.lon,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        1500,
      );
    }
  }, [currentItem]);

  useEffect(() => {
    if (listOfVenues && listOfVenues.length > 0) {
      setCurrentItem(listOfVenues[0]);
    } else {
      setCurrentItem(null);
    }
  }, [listOfVenues]);

  return (
    <View style={styles.mainView}>
      <MapView
        ref={mapRef}
        style={[styles.mainView, styles.mapView]}
        initialRegion={{
          latitude: 23.8859,
          longitude: 45.0792,
          latitudeDelta: 100,
          longitudeDelta: 100,
        }}>
        {listOfVenues &&
          listOfVenues.length > 0 &&
          listOfVenues.map((item, index) => {
            const color =
              pinColors[Math.floor(Math.random() * pinColors.length)];
            return (
              <MapMarker
                coordinate={{
                  latitude: item.lat,
                  longitude: item.lon,
                }}
                title={item.name}
                description={item.address}
                key={item.id}
                onPress={() => scrollToCard(index)}
                pinColor={color}
              />
            );
          })}
      </MapView>
      <View
        style={[
          styles.cardSectionView,
          {
            width: width - 40,
          },
        ]}>
        {listOfVenues && listOfVenues.length > 0 && (
          <ScrollView
            ref={scrollRef}
            horizontal
            pagingEnabled
            onScroll={handleScroll}
            style={styles.scrollView}>
            {listOfVenues?.map(renderCardItem)}
          </ScrollView>
        )}
        {(listOfVenues == undefined || listOfVenues == null) && (
          <View style={styles.loaderView}>
            <ActivityIndicator size={'large'} />
          </View>
        )}
        {listOfVenues && listOfVenues.length == 0 && (
          <View style={styles.noDataView}>
            <Text style={styles.noDataText}>
              {AppStrings.NoVenuesFoundText}
            </Text>
          </View>
        )}
      </View>
      <TouchableOpacity
        onPress={getVenuesFromAPI}
        style={styles.reloadTouchableOpacity}>
        <Image
          source={require('../assets/refresh-arrow.png')}
          resizeMode="contain"
          style={styles.reloadImage}
        />
      </TouchableOpacity>
    </View>
  );
};

export default MapViewScreen;

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
  },
  mapView: {
    width: '100%',
    height: '100%',
  },
  cardSectionView: {
    backgroundColor: 'white',
    position: 'absolute',
    bottom: 20,
    marginHorizontal: 20,
    borderRadius: 10,
    padding: 10,
  },
  scrollView: {
    backgroundColor: 'white',
  },
  loaderView: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 60,
  },
  noDataView: {
    paddingHorizontal: 20,
    paddingVertical: 60,
  },
  noDataText: {
    fontSize: 13,
    color: 'black',
    textAlign: 'center',
  },
  reloadTouchableOpacity: {
    backgroundColor: 'white',
    height: 40,
    width: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 20,
    right: 20,
  },
  reloadImage: {
    width: 24,
    height: 24,
    tintColor: '#007fff',
  },
});
