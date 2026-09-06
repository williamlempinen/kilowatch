import { useQuery } from '@tanstack/react-query'
import { apiFetch } from '../api.ts'

function Statistics() {
    const _result = useQuery({
        queryKey: ['day'],
        queryFn: ({ signal }) => apiFetch('/day', signal)
    })

    return (
        <div>
            <div>
                <p>Statistics</p>
            </div>
            <div>
                <p>Statistics</p>
            </div>

            <div>
                <p>Statistics</p>
            </div>
        </div>
    )
}

export default Statistics
