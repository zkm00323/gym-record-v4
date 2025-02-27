import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    title: {
        fontFamily: 'poppins-Bold',
        fontSize: 50,
        fontWeight: 'bold',
        color: '#333',
    },
    subtitle: {
        fontFamily: 'poppins-Regular',
        fontSize: 16,
        color: '#666',
    },
    input: {
        width: '75%',
        maxWidth: 300,
        height: 45,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 99,
        paddingLeft: 15,
        paddingRight: 15,
    },
    register: {
        width: '75%',
        maxWidth: 300,
        height: 45,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 99,
        paddingLeft: 15,
        paddingRight: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    login: {
        width: '75%',
        maxWidth: 300,
        height: 45,
        borderRadius: 99,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
    },
    divider: {
        width: '75%',
        maxWidth: 300,
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#ccc',
    }
});