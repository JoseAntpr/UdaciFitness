import React, { Component } from 'react'
import { View, TouchableOpacity, Text } from 'react-native'
import { getMetricMetaInfo, timeToString } from '../utils/helpers'
import FitnessSlider from './FitnessSlider'
import FitnessStepper from './FitnessStepper'
import DateHeader from './DateHeader'
import { Ionicons } from '@expo/vector-icons'
import TextButton from './TextButton'
import { submitEntry, removeEntry } from '../utils/api'

const SubmitBtn = ({ onPress }) => (
    <TouchableOpacity onPress={onPress}>
        <Text>SUBMIT</Text>
    </TouchableOpacity>
)

class AddEntry extends Component {
    state = {
        run: 0,
        swim: 0,
        bike: 0,
        eat: 0,
        sleep: 0,
    }

    increment = (metric) => {
        const { max, step } = getMetricMetaInfo(metric)

        this.setState((state) => {
            const count = state[metric] + step

            return {
                ...state,
                [metric]: count > max ? max : count
            }
        })
    }

    decrement = (metric) => {

        this.setState((state) => {
            const count = state[metric] - getMetricMetaInfo(metric).step

            return {
                ...state,
                [metric]: count < 0 ? 0 : count
            }
        })
    }

    slide = (metric, value) => {
        this.setState(() => ({
            [metric]: value
        }))
    }   

    submit = () => {
        const key = timeToString()
        const entry = this.state

        // Update Redux

        this.setState(() => ({
            run: 0,
            swim: 0,
            bike: 0,
            eat: 0,
            sleep: 0,
        }))

        // Navigate home

        submitEntry({ key, entry })

        // Clean local notification
    }
    
    reset = () => {
       const key = timeToString()
        // Update Redux

        // Navigate home

        removeEntry(key)
    }

    render() {

        // Change to this.props.alreadyLogged
        if (true) {
            return (
                <View>
                    <Ionicons name='ios-happy-outline' size={100}/>
                    <Text>You already logged your information for today.</Text>
                    <TextButton onPress={this.reset}>
                        Reset
                    </TextButton>
                </View>
            )
        }

        const metaInfo = getMetricMetaInfo()
        return (
            <View>
                <DateHeader date={(new Date()).toLocaleDateString()} />
                {Object.keys(metaInfo).map((key) => {
                    const { getIcon, type, ...rest } = metaInfo[key]
                    const value = this.state[key]

                    return (
                        <View key={key}>
                            {getIcon()}
                            {type === 'slider'
                                ? <FitnessSlider value={value} onChange={(value) => this.slide(key, value)} {...rest}/>
                                : <FitnessStepper value={value} onIncrement={() => this.increment(key)} onDecrement={() => this.decrement(key)} {...rest}/>
                            }
                        </View>
                    )
                })}
                <SubmitBtn onPress={this.submit}/>
            </View>
        )    
    }
}

export default AddEntry