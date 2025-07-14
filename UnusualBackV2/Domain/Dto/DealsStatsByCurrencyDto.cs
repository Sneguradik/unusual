namespace Domain.Dto;

public record DealsStatsByCurrencyDto(DateTime Day, Dictionary<string, int> stats);