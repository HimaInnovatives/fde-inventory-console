package com.fde;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class DatabaseManager {
    private static final String URL = "jdbc:postgresql://localhost:5432/postgres";
    private static final String USER = "postgres";
    private static final String PASS = "root";

    public static Connection getConnection() throws SQLException {
        return DriverManager.getConnection(URL, USER, PASS);
    }

    public static void saveItem(String name) {
        String query = "INSERT INTO inventory_items (product_name) VALUES (?);";
        try (Connection conn = getConnection(); PreparedStatement pst = conn.prepareStatement(query)) {
            pst.setString(1, name);
            pst.executeUpdate();
        } catch (SQLException e) { System.out.println("Error saving: " + e.getMessage()); }
    }

    public static List<Item> getAllItems() {
        List<Item> items = new ArrayList<>();
        String query = "SELECT id, product_name FROM inventory_items ORDER BY id;";
        try (Connection conn = getConnection(); Statement st = conn.createStatement(); ResultSet rs = st.executeQuery(query)) {
            while (rs.next()) {
                items.add(new Item(rs.getInt("id"), rs.getString("product_name")));
            }
        } catch (SQLException e) { System.out.println("Error fetching: " + e.getMessage()); }
        return items;
    }
}
