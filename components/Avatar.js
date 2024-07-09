import React from 'react';
import { Image, StyleSheet } from 'react-native';

const Avatar = ({ uri, size = 100 }) => {
  return (
    <Image
      source={{ uri }}
      style={[styles.avatar, { width: size, height: size, borderRadius: size / 2 }]}
    />
  );
};

const styles = StyleSheet.create({
  avatar: {
    marginBottom: 20,
  },
});

export default Avatar;
