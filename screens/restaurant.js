import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, SafeAreaView, Animated } from "react-native";
import { isIphoneX } from "react-native-iphone-x-helper";
import { icons, images, SIZES, COLORS, FONTS } from '../constants';


const Restaurant = ({ route, navigation }) => {
    const scrollX = new Animated.Value(0);
    const [restaurant, setRestaurant] = React.useState(null);
    const [currentLocation, setCurrentLocation] = React.useState(null);
    const [orderItem, setOrderItem] = React.useState([]);

    React.useEffect(() => {
        let { item, location } = route.params;
        setRestaurant(item);
        setCurrentLocation(location);
    });

    function editOrder(action, menuId, price) {
        let orderList = orderItem.slice();
        let item = orderList.filter(a => a.menuId == menuId);

        if (action == "+") {
            if (item.length > 0) {
                let newQty = item[0].qty + 1;
                item[0].qty = newQty;
                item[0].total = item[0].qty * price;
            } else {
                const newItem = {
                    menuId: menuId,
                    qty: 1,
                    price: price,
                    total: price
                }
                orderList.push(newItem);
            }
            setOrderItem(orderList);
        } else {
            if (item.length > 0) {
                if (item[0]?.qty > 0) {
                    let newQty = item[0].qty - 1;
                    item[0].qty = newQty;
                    item[0].total = item[0].qty * price;
                }
            }
            setOrderItem(orderList);
        }
    }

    function getOrderQuantity(menuId) {
        let orderItems = orderItem.filter(a => a.menuId == menuId);
        if (orderItems.length > 0) {
            return orderItems[0].qty;
        }
        return 0;
    }

    function getTotal() {
        let total = orderItem.reduce((a, b) => a + (b.qty || 0), 0);
        return total;
    }

    function sumOrder() {
        let total = orderItem.reduce((a, b) => a + (b.total || 0), 0);
        return total.toFixed(2);
    }

    function renderHeader() {
        return (
            <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity
                    style={{
                        width: 50,
                        paddingLeft: SIZES.padding * 2,
                        justifyContent: 'center'
                    }}
                    onPress={() => navigation.goBack()}
                >
                    <Image
                        source={icons.back}
                        resizeMode="contain"
                        style={{
                            width: 30,
                            height: 30
                        }}
                    />
                </TouchableOpacity>

                {/* Restaurant Name Section */}
                <View
                    style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <View
                        style={{
                            height: 50,
                            alignItems: 'center',
                            justifyContent: 'center',
                            paddingHorizontal: SIZES.padding * 3,
                            borderRadius: SIZES.radius,
                            backgroundColor: COLORS.lightGray3
                        }}
                    >
                        <Text style={{ ...FONTS.h3 }}>{restaurant?.name}</Text>
                    </View>
                </View>

                <TouchableOpacity
                    style={{
                        width: 50,
                        paddingRight: SIZES.padding * 2,
                        justifyContent: 'center'
                    }}
                >
                    <Image
                        source={icons.list}
                        resizeMode="contain"
                        style={{
                            width: 30,
                            height: 30
                        }}
                    />
                </TouchableOpacity>
            </View>
        )
    }

    function renderFoodInfo() {
        return (
            <Animated.ScrollView
                horizontal
                pagingEnabled
                scrollEventThrottle={16}
                snapToAlignment="center"
                showsHorizontalScrollIndicator={false}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                    { useNativeDriver: false }
                )}
            >
                {
                    restaurant?.menu.map((item, index) => (
                        <View
                            key={`menu-${index}`}
                            style={{ alignItems: "center" }}
                        >
                            <View style={{ height: SIZES.height * 0.35 }}>
                                {/* Food Image */}
                                <Image
                                    source={item.photo}
                                    resizeMode="cover"
                                    style={{
                                        width: SIZES.width,
                                        height: "100%"
                                    }}
                                />
                                {/* Quantity */}
                                <View
                                    style={{
                                        position: "absolute",
                                        bottom: -20,
                                        height: 50,
                                        width: SIZES.width,
                                        justifyContent: "center",
                                        flexDirection: "row",
                                    }}
                                >
                                    <TouchableOpacity
                                        style={{
                                            height: 50,
                                            width: 50,
                                            backgroundColor: COLORS.white,
                                            justifyContent: "center",
                                            alignItems: "center",
                                            borderBottomLeftRadius: SIZES.radius,
                                            borderTopLeftRadius: SIZES.radius
                                        }}
                                        onPress={() => editOrder("-", item.menuId, item.price)}
                                    >
                                        <Text style={{ ...FONTS.body1 }}>-</Text>
                                    </TouchableOpacity>
                                    <View
                                        style={{
                                            width: 50,
                                            backgroundColor: COLORS.white,
                                            justifyContent: "center",
                                            alignItems: "center",
                                        }}
                                    >
                                        <Text style={{ ...FONTS.h2 }}>{getOrderQuantity(item.menuId)}</Text>
                                    </View>
                                    <TouchableOpacity
                                        style={{
                                            height: 50,
                                            width: 50,
                                            backgroundColor: COLORS.white,
                                            justifyContent: "center",
                                            alignItems: "center",
                                            borderBottomRightRadius: SIZES.radius,
                                            borderTopRightRadius: SIZES.radius
                                        }}
                                        onPress={() => editOrder("+", item.menuId, item.price)}
                                    >
                                        <Text style={{ ...FONTS.body1 }}>+</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            {/* Name and description */}
                            <View
                                style={{
                                    width: SIZES.width,
                                    alignItems: "center",
                                    paddingHorizontal: SIZES.padding,
                                    marginTop: 15,
                                }}
                            >
                                <Text style={{ marginVertical: 10, textAlign: "center", ...FONTS.h2 }}>{item.name} - {item.price.toFixed(2)}</Text>
                                <Text style={{ ...FONTS.body3 }}>{item.description}</Text>
                            </View>
                            {/* Calories */}
                            <View
                                style={{
                                    flexDirection: "row",
                                    marginTop: 10,
                                    alignItems: "center"
                                }}
                            >
                                <Image
                                    source={icons.fire}
                                    style={{
                                        width: 20,
                                        height: 20,
                                        marginRight: 10,
                                    }}
                                />
                                <Text style={{ ...FONTS.body3, color: COLORS.darkgray }}>{item.calories.toFixed(2)} cal</Text>
                            </View>

                        </View>
                    ))
                }
            </Animated.ScrollView>
        )
    }

    function renderDots() {
        const dotPosition = Animated.divide(scrollX, SIZES.width);

        return (
            <View style={{ height: 30 }}>
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: SIZES.padding
                }}>
                    {
                        restaurant?.menu.map((item, index) => {
                            const opacity = dotPosition.interpolate({
                                inputRange: [index - 1, index, index + 1],
                                outputRange: [0.3, 1, 0.3],
                                extrapolate: "clamp"
                            })

                            const dotSize = dotPosition.interpolate({
                                inputRange: [index - 1, index, index + 1],
                                outputRange: [SIZES.base * 0.8, 10, SIZES.base * 0.8],
                                extrapolate: "clamp"
                            })

                            const dotColor = dotPosition.interpolate({
                                inputRange: [index - 1, index, index + 1],
                                outputRange: [COLORS.darkgray, COLORS.primary, COLORS.darkgray],
                                extrapolate: "clamp"
                            })
                            return (
                                <Animated.View
                                    key={`dot-${index}`}
                                    opacity={opacity}
                                    style={{
                                        width: dotSize,
                                        height: dotSize,
                                        borderRadius: SIZES.radius,
                                        marginHorizontal: 6,
                                        backgroundColor: dotColor,
                                    }}
                                />
                            )
                        })
                    }
                </View>
            </View>
        )
    }

    function renderOder() {
        return (
            <View>
                {
                    renderDots()
                }
                <View
                    style={{
                        backgroundColor: COLORS.white,
                        borderTopLeftRadius: 40,
                        borderTopRightRadius: 40,
                    }}
                >
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            paddingVertical: SIZES.padding * 2,
                            paddingHorizontal: SIZES.padding * 3,
                            borderBottomColor: COLORS.lightGray2,
                            borderBottomWidth: 1
                        }}
                    >
                        <Text style={{ ...FONTS.h3 }}>{getTotal()} items in Cart</Text>
                        <Text style={{ ...FONTS.h3 }}>${sumOrder()}</Text>
                    </View>
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            paddingVertical: SIZES.padding * 2,
                            paddingHorizontal: SIZES.padding * 3,
                        }}
                    >
                        <View style={{ flexDirection: "row", }}>
                            <Image
                                source={icons.pin}
                                resizeMode="contain"
                                style={{
                                    height: 20,
                                    width: 20,
                                    tintColor: COLORS.darkgray
                                }}
                            />
                            <Text style={{ marginLeft: SIZES.padding, ...FONTS.h3 }}>Location</Text>
                        </View>
                        <View style={{ flexDirection: "row", }}>
                            <Image
                                source={icons.master_card}
                                resizeMode="contain"
                                style={{
                                    height: 20,
                                    width: 20,
                                    tintColor: COLORS.darkgray
                                }}
                            />
                            <Text style={{ marginLeft: SIZES.padding, ...FONTS.h3 }}>1508</Text>
                        </View>
                    </View>
                    {/* Order button */}
                    <View
                        style={{
                            padding: SIZES.padding * 2,
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <TouchableOpacity
                            style={{
                                padding: SIZES.padding,
                                alignItems: "center",
                                width: SIZES.width * 0.9,
                                backgroundColor: COLORS.primary,
                                borderRadius: SIZES.radius
                            }}
                        >
                            <Text style={{ ...FONTS.h2, color: COLORS.white }}>Order</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                {isIphoneX() &&
                    <View
                        style={{
                            backgroundColor: COLORS.white,
                            position: 'absolute',
                            bottom: -34,
                            left: 0,
                            right: 0,
                            height: 34,
                        }}
                    >

                    </View>
                }
            </View>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            {renderHeader()}
            {renderFoodInfo()}
            {renderOder()}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.lightGray4,
    },
    shadow: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 1,
    }
});

export default Restaurant;