const TopDiseases = (props) => {
    
    return (
        <div>
            <h> {props.continent} Top Dieseases</h>
            {props.diseases.map((disease) => (
                <body key={disease.id}>{disease.id}. {disease.name} </body>
            ))}
        </div>
    )
}

export default TopDiseases